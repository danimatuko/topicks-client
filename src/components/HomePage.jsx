import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import Post from '../stores/PostStore';
import PostPreview from './PostPreview';
import RecommandedTopics from './RecommandedTopics';
import { StoreContext } from '../stores/RootStore';
import { Link } from 'react-router-dom';
import Paginate from './Paginate';

const HomePage = ({ location, history }) => {
  const [latestPosts, setLatestPosts] = useState(null);
  const [mostLikedPosts, setMostLikedPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState(null);
  const [postsByTopic, setPostsByTopic] = useState({
    topic: '',
    posts: [],
  });
  const pageNumber = Number(location.search.split('=')[1] || 1);

  useContext(StoreContext);

  const isFirstRun = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Post.getLatestPosts();
        setIsLoading(false);
        setLatestPosts(data);
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Post.getMostLikedPosts();
        setIsLoading(false);
        setMostLikedPosts(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  // limited number of results (pagination)
  const getAllPosts = async () => {
    try {
      const { data } = await Post.getAllPosts(pageNumber);
      setAllPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const pickTopic = () => {
    setPostsByTopic({
      topic: '',
      posts: [],
    });
  };

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return; // return from the useEffect function if this is the first render
    }
    getAllPosts();
    // eslint-disable-next-line
  }, [pageNumber]);

  return (
    <>
      <Container id='home-posts-container'>
        <Row className='my-5 d-flex justify-content-between'>
          <Col md={6}>
            {allPosts ? (
              <Link
                as={Button}
                className='text-dark me-3'
                to='#'
                onClick={() => setAllPosts([])}>
                <i className='fas fa-times'></i> All Posts
              </Link>
            ) : (
              <Link
                as={Button}
                className='text-dark me-3'
                to='#'
                onClick={() => history.push('/posts')}>
                View All Posts
              </Link>
            )}
            {postsByTopic.topic && (
              <Link
                className='text-dark me-3'
                to='#'
                onClick={() => pickTopic()}>
                <i className='fas fa-times me-1'></i>
                {postsByTopic.topic}
              </Link>
            )}
            {postsByTopic.topic && (
              <Row className='mt-3'>
                <h2 className='display-6 my-5 fw-bold text-primary'>
                  {postsByTopic.topic}
                </h2>
                {isLoading ? (
                  <Spinner
                    animation='border'
                    className='d-block mx-auto'
                  />
                ) : (
                  postsByTopic.posts?.map((post) => (
                    <PostPreview
                      key={post._id}
                      post={post}
                    />
                  ))
                )}
              </Row>
            )}
            {allPosts && postsByTopic.topic === '' && (
              <Row
                className='mb-5 mx-auto'
                key={pageNumber}>
                <h2 className='display-6 my-5 fw-bold text-primary'>
                  All Posts
                </h2>
                {isLoading ? (
                  <Spinner
                    animation='border'
                    className='d-block mx-auto'
                  />
                ) : (
                  allPosts &&
                  allPosts.posts?.map((post) => (
                    <PostPreview
                      key={post._id}
                      post={post}
                    />
                  ))
                )}
                {/* 
                <Paginate
                  total={allPosts.totalPages}
                  page={allPosts.page}
                  path='posts'
                /> */}
              </Row>
            )}
            {postsByTopic.topic === '' && !allPosts && (
              <>
                <Row className='mb-5 mx-auto'>
                  <h2 className='display-6 my-4 fw-bold text-primary'>
                    Latest
                  </h2>
                  {isLoading ? (
                    <Spinner
                      animation='border'
                      className='d-block mx-auto'
                    />
                  ) : (
                    latestPosts &&
                    latestPosts.map((post) => (
                      <PostPreview
                        key={post._id}
                        post={post}
                      />
                    ))
                  )}
                </Row>
                <Row className='mb-5 mx-auto'>
                  <h2 className='display-6 mb-4 fw-bold text-primary'>
                    Most Liked
                  </h2>
                  {isLoading ? (
                    <Spinner
                      animation='border'
                      className='d-block mx-auto'
                    />
                  ) : (
                    mostLikedPosts &&
                    mostLikedPosts.map((post) => (
                      <PostPreview
                        key={post._id}
                        post={post}
                      />
                    ))
                  )}
                </Row>
              </>
            )}
          </Col>

          <Col
            md={4}
            sm={6}
            xs={12}
            className='border-start'>
            <RecommandedTopics setPostsByTopic={setPostsByTopic} />

            <Container>
              <h2 className='h5 mb-4 mt-4 fw-bold'>Reading List</h2>
              <p>
                Click the<i className='far fa-bookmark mx-1'></i>
                on any story to easily add it to your reading list or a custom
                list that you can share.
              </p>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
