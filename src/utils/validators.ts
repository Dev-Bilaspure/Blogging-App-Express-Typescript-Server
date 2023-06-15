import { z } from "zod";

export const loginUserSchema = z
  .object({
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
  })
  .strict();

export const signupUserSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long"),
  })
  .strict();

export const updateUserSchema = z
  .object({
    firstName: z.string().nonempty("First name is required").optional(),
    lastName: z.string().nonempty("Last name is required").optional(),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .optional(),
    username: z.string().nonempty("Username is required").optional(),
    bio: z.string().nonempty("Bio is required").optional(),
    profilePicture: z
      .string()
      .nonempty("Profile picture is required")
      .optional(),
  })
  .strict();

export const followUserSchema = z
  .object({
    userIdToFollow: z.string().nonempty("User ID is required"),
  })
  .strict();

export const unfollowUserSchema = z
  .object({
    userIdToUnfollow: z.string().nonempty("User ID is required"),
  })
  .strict();



export const createUpdatePostSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
    userId: z.string().nonempty("User ID is required"),
    postId: z.string().nonempty("Post ID is required"),
  })
  .strict();

export const publishUnpublishPostSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
}).strict();

export const likeUnlikePostUpdatesSchema = z
  .object({
    userId: z.string().nonempty("User ID is required"),
  })
  .strict();

export const bookmarkUnbookmarkAPostSchema = z
  .object({
    postId: z.string().nonempty("Post ID is required"),
  })
  .strict();

export const createCommentSchema = z
  .object({
    postId: z.string().nonempty("Post ID is required"),
    authorId: z.string().nonempty("User ID is required"),
    content: z.string().nonempty("Comment content cannot be empty"),
  })
  .strict();

export const updateCommentSchema = z
  .object({
    content: z.string().nonempty("Comment content cannot be empty"),
    userId: z.string().nonempty("User ID is required"),
  })
  .strict();

export const likeUnlikeACommentSchema = z
  .object({
    userId: z.string().nonempty("Comment ID is required"),
  })
  .strict();




// dump=============================================:



// export const createPostSchema = z
//   .object({
//     title: z.string().nonempty("Title is required"),
//     description: z.string().nonempty("Description is required"),
//     image: z.string().optional(),
//     tags: z.array(z.string()).optional(),
//     isPublished: z.boolean(),
//     authorId: z.string().nonempty("Author ID is required"),
//   })
//   .strict();

// export const updatePostSchema = z
//   .object({
//     title: z.string().nonempty("Title cannot be empty").optional(),
//     description: z.string().nonempty("Description cannot be empty").optional(),
//     image: z.string().optional(),
//     tags: z.array(z.string()).optional(),
//     isPublished: z.boolean().optional(),
//     userId: z.string().nonempty("User ID is required"),
//   })
//   .strict();
