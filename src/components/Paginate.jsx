import React from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ total = 1, page, path }) => {
  const location = useLocation();
  path = path || location.pathname;
  if (total <= 1) return null;
  console.log('total', total);

  return (
    <Pagination className='justify-content-center my-3'>
      {[...Array(Math.ceil(total)).keys()].map((p) => (
        <LinkContainer
          key={p}
          to={`/${path}/?page=${p + 1}`}>
          <Pagination.Item
            className='text-dark'
            active={p + 1 === Number(page)}>
            {p + 1}
          </Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
};

export default Paginate;
