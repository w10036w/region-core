import React, { Fragment } from 'react';
import { connectWith } from 'region-shortcut';
import { Button } from 'antd';
import RawLoading from './Loading';
import { loadSome } from '../../shared/load';

const Display = ({ user, some }) => (
  <div style={{ flex: 1, width: '100%', padding: 10 }}>
    <h1>{user}</h1>
    <p>{some}</p>
  </div>
);

const Control = ({ user, some }) => (
  <Fragment>
    {!some && (
      <div style={{ padding: 10 }}><Button onClick={loadSome}>click to load something</Button></div>
    )}
    <Display user={user} some={some} />
  </Fragment>
);

const Loading = ({ user, some }) => (
  <Fragment>
    <RawLoading loading />
    <Display user={user} follower={some} />
  </Fragment>
);

export default connectWith(['user', 'some'], Control, { Loading });