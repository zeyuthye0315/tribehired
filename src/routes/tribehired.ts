export {};
import { Request, Response } from "express";
const express = require("express");
const router = express.Router();
const axios = require("axios");
const https = require("https");

const ENDPOINT = " https://jsonplaceholder.typicode.com";

// interfaces:
interface PostProps {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface CommentProps {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// util function:
const genericAxiosGet = (url: string, params: any) => {
  return instance
    .get(ENDPOINT + url, {
      params: params,
      headers: {
        "Accept-Encoding": null,
      },
    })
    .then((response: any) => {
      return response.data;
    })
    .catch((e: string) => {
      console.error(e);
      return {};
    });
};

const getCommentOccuranceListUtil = async (
  all_comments: CommentProps[],
  all_posts: PostProps[]
) => {
  const list = [];

  for (let i = 0; i <= 100; i++) {
    const current_comments = all_comments.filter((comment) => {
      return comment.postId === i;
    });

    if (current_comments.length >= 1) {
      const current_post = all_posts.filter((post: any) => {
        return post.id === current_comments[0].postId;
      });

      const current_object = {
        post_id: current_post[0].id,
        post_title: current_post[0].title,
        post_body: current_post[0].body,
        total_number_of_comments: current_comments.length,
      };

      list.push(current_object);
    }
  }

  return list;
};

/**
 * Question (1)
 * Return a list of Top Posts ordered by their number of Comments:
 */
router.get("/top-posts", async (req: Request, res: Response) => {
  const all_comments = await genericAxiosGet("/comments", {});

  const all_posts = await genericAxiosGet(`/posts`, {});

  const response = await getCommentOccuranceListUtil(all_comments, all_posts);

  // sort the response:
  const sortedResponse = response.sort((p1, p2) =>
    p1.total_number_of_comments < p2.total_number_of_comments
      ? 1
      : p1.total_number_of_comments > p2.total_number_of_comments
      ? -1
      : 0
  );

  res.send(sortedResponse);
});

/**
 * Question (2):
 * Search API Create an endpoint that allows a user to filter the comments based on all the available fields.
 */
router.get("/search", async (req: Request, res: Response) => {
  const field = req.query.field as string;
  const value = req.query.value as string;
  const all_comments = await genericAxiosGet("/comments", {});

  const filteredComments = all_comments.filter((comment: any) => {
    return comment[field] == value;
  });

  res.send(filteredComments);
});

module.exports = router;
