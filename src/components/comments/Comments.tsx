import React, { useState, useEffect, useMemo } from 'react';
import { useCommentStore } from '../../store/commentStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Trash2, Edit2, Reply, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentsProps {
  podcastId: string;
}

interface CommentType {
  id: string;
  content: string;
  created_at: string;
  username: string;
  parent_id: string | null;
}

interface CommentWithReplies extends CommentType {
  replies: CommentWithReplies[];
}

export const Comments: React.FC<CommentsProps> = ({ podcastId }) => {
  const { comments, fetchComments, addComment, deleteComment, updateComment } = useCommentStore();
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const commentInputRef = React.useRef<HTMLInputElement>(null);
  const replyInputRef = React.useRef<HTMLInputElement>(null);
  const editInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchComments(podcastId);
  }, [fetchComments, podcastId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(podcastId, newComment);
    setNewComment('');
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    await addComment(podcastId, replyContent, parentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) return;

    await updateComment(commentId, editContent);
    setEditingId(null);
    setEditContent('');
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const value = e.target.value;
      setNewComment(value);
    }
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const value = e.target.value;
      setReplyContent(value);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const value = e.target.value;
      setEditContent(value);
    }
  };

  useEffect(() => {
    if (replyingTo) {
      replyInputRef.current?.focus();
    }
  }, [replyingTo]);

  useEffect(() => {
    if (editingId) {
      editInputRef.current?.focus();
    }
  }, [editingId]);

  // Organize comments into a tree structure
  const commentTree = useMemo(() => {
    const tree: CommentWithReplies[] = [];
    const commentMap = new Map<string, CommentWithReplies>();

    // First, convert all comments to CommentWithReplies
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Then, organize them into a tree
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        tree.push(commentWithReplies);
      }
    });

    return tree;
  }, [comments]);

  const CommentComponent: React.FC<{ 
    comment: CommentWithReplies;
    depth?: number;
  }> = ({ comment, depth = 0 }) => {
    const maxDepth = 3; // Maximum nesting level

    return (
      <div className={`${depth > 0 ? 'ml-6 mt-3 pl-6 border-l border-gray-600' : ''}`}>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <Link
              to={`/profile/${comment.username}`}
              className="font-medium text-green-400 hover:text-green-300"
            >
              @{comment.username}
            </Link>
            <div className="text-sm text-gray-400">
              {new Date(comment.created_at).toLocaleDateString()}
            </div>
          </div>

          {editingId === comment.id ? (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <input
                ref={editInputRef}
                type="text"
                value={editContent}
                onChange={handleEditChange}
                className="w-full bg-gray-600 text-white rounded px-3 py-2"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUpdate(comment.id)}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-white">{comment.content}</p>
          )}

          {user && depth < maxDepth && (
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Reply className="h-4 w-4" />}
                onClick={() => setReplyingTo(comment.id)}
              >
                Reply
              </Button>
              {user.username === comment.username && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Edit2 className="h-4 w-4" />}
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => deleteComment(comment.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          )}

          {replyingTo === comment.id && (
            <div className="mt-3 bg-gray-600 rounded-lg p-3" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm text-gray-300 mb-2">
                Replying to @{comment.username}
              </p>
              <input
                ref={replyInputRef}
                type="text"
                value={replyContent}
                onChange={handleReplyChange}
                placeholder="Write a reply..."
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleReply(comment.id)}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {comment.replies.length > 0 && (
          <div className="space-y-3 mt-3">
            {comment.replies.map((reply) => (
              <CommentComponent 
                key={reply.id} 
                comment={reply} 
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Comments</h3>
      
      {/* New Comment Form */}
      {user && (
        <form 
          onSubmit={handleSubmit} 
          className="mb-6" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2">
            <input
              ref={commentInputRef}
              type="text"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2"
              autoComplete="off"
            />
            <Button type="submit" variant="primary" leftIcon={<Send className="h-4 w-4" />}>
              Post
            </Button>
          </div>
        </form>
      )}

      {/* Comments Tree */}
      <div className="space-y-4">
        {commentTree.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
