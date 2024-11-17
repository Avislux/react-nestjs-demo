import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { Fragment, useEffect } from 'react';
import { getUserName, logoutUser } from '../store/userSlice.ts';
export default function Root() {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.users);

  return (
    <>
      <div id="sidebar">
        <h1></h1>
        <div>
          <form id="search-form" role="search">
          </form>
          <form method="post">
          </form>
        </div>
        <nav>
          <div>Navigation</div>
          <ul>
            <li>
              <Link to={`/`}>Home</Link>
            </li>
            {userState.user === null && (
              <Fragment>
                <li>
                  <Link to={`/login`}>Login</Link>
                </li>
              </Fragment>
            )}
            <li>
            <Link to={`/invoices`}>Invoices</Link>
            </li>
            {userState.user !== null && (
              <Fragment>
                <li>
                  <a onClick={() => dispatch(logoutUser())}>Logout</a>
                </li>
              </Fragment>
            )}

          </ul>
        </nav>
      </div>
      <Outlet />
    </>
  );
}
