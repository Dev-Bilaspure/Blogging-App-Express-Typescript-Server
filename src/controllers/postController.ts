import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import {
  createUpdatePostSchema,
  likeUnlikePostUpdatesSchema,
  publishUnpublishPostSchema,
  updatePostSchema,
} from "../utils/validators";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  RESOURCE_NOT_FOUND,
  UNAUTHORIZED,
} from "../utils/errorTypes";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    if (posts.length === 0) {
      res.status(200).json({ success: true, posts, message: "No posts found" });
      return;
    }
    res.status(200).json({ success: true, posts, message: "All posts found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const user = await User.findById(post?.authorId);

    const authorInfo = {
      _id: user?._id,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePicture: user?.profilePicture,
      followers: user?.followers,
    };

    res.status(200).json({
      success: true,
      post: { ...post.toObject(), authorInfo },
      message: "Post found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const getNonPublishedPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    const posts = await Post.find({ authorId: userId, isPublished: false }).sort({ createdAt: -1 });
    if(posts.length === 0) {
      res.status(200).json({
        success: true,
        message: "No posts found for this user",
        posts,
      });
      return;
    }
    res.status(200).json({ success: true, posts, message: "Posts found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
}

export const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const posts = await Post.find({ authorId: userId, isPublished: true }).sort(
      { createdAt: -1 }
    );

    if (posts.length === 0) {
      res.status(200).json({
        success: true,
        message: "No posts found for this user",
        posts,
      });
      return;
    }

    res.status(200).json({ success: true, posts, message: "Posts found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  try {
    try {
      publishUnpublishPostSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    if (post.isPublished) {
      res.status(400).json({
        success: false,
        message: "Post is already published",
        errorType: BAD_REQUEST,
      });
      return;
    }
    if (post.authorId.toString() !== req.body.userId.toString()) {
      res.status(401).json({
        success: false,
        message: "You can only publish your own posts",
        errorType: UNAUTHORIZED,
      });
      return;
    }

    post.isPublished = true;
    const postPublished = await post.save();
    res.status(200).json({
      success: true,
      message: "Post published sucessfully",
      post: postPublished,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const unpublishPost = async (req: Request, res: Response) => {
  try {
    try {
      publishUnpublishPostSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    if (!post.isPublished) {
      res.status(400).json({
        success: false,
        message: "Post is already unpublished",
        errorType: BAD_REQUEST,
      });
      return;
    }
    if (post.authorId.toString() !== req.body.userId.toString()) {
      res.status(401).json({
        success: false,
        message: "You can only unpublish your own posts",
        errorType: UNAUTHORIZED,
      });
      return;
    }

    post.isPublished = false;
    const postUnpublished = await post.save();
    res.status(200).json({
      success: true,
      message: "Post unpublished sucessfully",
      post: postUnpublished,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    if (post.authorId.toString() !== userId) {
      res.status(401).json({
        success: false,
        message: "You can only delete your own posts",
        errorType: UNAUTHORIZED,
      });
      return;
    }
    const deletedPost = await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const likeAPost = async (req: Request, res: Response) => {
  try {
    try {
      likeUnlikePostUpdatesSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      res.status(400).json({
        success: false,
        message: "You have already liked this post",
        errorType: BAD_REQUEST,
      });
      return;
    }

    post.likes.push(userId);

    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200).json({
      success: true,
      post: updatedPost?.toObject(),
      message: "Post liked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const unlikeAPost = async (req: Request, res: Response) => {
  try {
    try {
      likeUnlikePostUpdatesSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const isLiked = post.likes.includes(userId);
    if (!isLiked) {
      res.status(400).json({
        success: false,
        message: "You have not liked this post",
        errorType: BAD_REQUEST,
      });
      return;
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());

    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    res.status(200).json({
      success: true,
      post: updatedPost?.toObject(),
      message: "Post unliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const getUsersLikedPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    const posts = await Post.find({
      likes: { $in: [userId] },
      isPublished: true,
    }).sort({ createdAt: -1 });

    if (posts.length === 0) {
      res.status(200).json({ success: true, message: "No posts found", posts });
      return;
    }
    res
      .status(200)
      .json({ success: true, posts, message: "Posts fetched successfully" });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPostsByTag = async (req: Request, res: Response) => {
  try {
    const { tag } = req.params;
    const posts = await Post.find({ tags: { $in: [tag] } }).sort({
      createdAt: -1,
    });
    if (posts.length === 0) {
      res.status(200).json({ success: true, posts, message: "No posts found" });
      return;
    }
    res.status(200).json({ success: true, posts, message: "All posts found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    try {
      updatePostSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const user = await User.findById(req.body.authorId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    if (post.authorId.toString() !== req.body.authorId.toString()) {
      res.status(401).json({
        success: false,
        message: "You can only update your own posts",
        errorType: UNAUTHORIZED,
      });
      return;
    }

    post.tags = req.body.tags;
    post.isPublished = req.body.isPublished;
    post.isCommentsEnabled = req.body.isCommentsEnabled;

    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });

    res.status(200).json({
      success: true,
      post: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

/// Dump============================

// export const createPost = async (req: Request, res: Response) => {
//   try {
//     const postInfo = req.body;
//     try {
//       createPostSchema.parse(postInfo);
//     } catch (error) {
//       res.status(400).json({
//         success: false,
//         message: "Some fields are missing or invalid",
//         error,
//       });
//     }
//     const { authorId } = postInfo;
//     const user = await User.findById(authorId);
//     if (!user) {
//       res.status(404).json({ success: false, message: "User not found" });
//       return;
//     }

//     const newPost = new Post({
//       ...postInfo,
//       authorInfo: {
//         firstName: user.firstName,
//         lastName: user.lastName,
//         profilePicture: user.profilePicture || "someimg",
//       },
//     });
//     const savedPost = await newPost.save();
//     res.status(201).json({
//       success: true,
//       post: savedPost,
//       message: "Post created successfully",
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Internal server error", error });
//   }
// };
