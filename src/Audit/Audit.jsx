import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";

import { Navbar, Nav } from "react-bootstrap";
import { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Pagination from "@material-ui/lab/Pagination";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import moment from "moment/moment";
function Auditpage(props) {
  const { user, users } = props;
  const [value, setValue] = useState(null);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalPage, setTotalPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => {
    props.getUsers();
  }, []);

  useEffect(() => {
    setFilter(users.items);
  }, [users]);

  const handleDeleteUser = (id) => {
    return (e) => props.deleteUser(id);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearch = (e) => {
    setData(e.target.value);
  };

  useEffect(() => {
    let newData = data
      ? users.items.filter((u) =>
          `${u.firstName} ${u.lastName}  ${u.role}`
            .toLowerCase()
            .includes(data.toLowerCase())
        )
      : users.items;

    if (value === "unames") {
      setFilter(
        newData && newData.sort((a, b) => a.username.localeCompare(b.username))
      );
    } else if (value === "fname") {
      setFilter(
        newData &&
          newData.sort((a, b) => a.firstName.localeCompare(b.firstName))
      );
    } else if (value === "lname") {
      setFilter(
        newData && newData.sort((a, b) => a.lastName.localeCompare(b.lastName))
      );
    } else if (value === "createdOn") {
      setFilter(
        newData &&
          newData.sort((a, b) => a.createdDate.localeCompare(b.createdDate))
      );
    }
    if (newData) {
      setUserList(subdivide(newData, 10));
      setPageNumber(1);
      setTotalPages(Math.ceil(newData.length / 10));
    }

    setFilter(newData);
  }, [users, data, value]);

  // useEffect(() => {
  //   if (filter) {
  //     setUserList(subdivide(filter, 10));
  //     setTotalPages(Math.ceil(filter.length / 10));
  //   }
  // }, [filter]);

  const subdivide = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      res.push(chunk);
    }
    return res;
  };

  const handleChangePageNumber = (event, value) => {
    setPageNumber(value);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>
          <Nav.Link href="#features">Auditor</Nav.Link>
          <Nav.Link>
            <Link to="/login">Logout</Link>
          </Nav.Link>
        </Nav>
      </Navbar>
      <div className="col-md-12 ">
        <div className="col-md-6 col-md-offset-3">
          <h1>Hi {user.firstName}!</h1>
          <p>You're logged in with React!!</p>
          <h3>All login audit :</h3>
        </div>
        <div style={{ margin: "2rem" }}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select value={value} onChange={handleChange}>
                  <MenuItem value={"uname"}>User name</MenuItem>
                  <MenuItem value={"fname"}>Frist Name</MenuItem>
                  <MenuItem value={"lname"}>Last Name</MenuItem>
                  <MenuItem value={"createdOn"}>Created On</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid style={{ paddingTop: "2rem" }}>
              <TextField
                label="Search"
                type="search"
                variant="outlined"
                value={data}
                onChange={handleSearch}
              />
            </Grid>
          </Grid>
        </div>
        {users.loading && <em>Loading users...</em>}
        {users.error && (
          <span className="text-danger">ERROR: {users.error}</span>
        )}
        {filter && userList[pageNumber - 1] && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created On</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList[pageNumber - 1].map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {moment(user.createdDate).format("DD/MM/YYYY, hh:mm a")}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="delete">
                      <DeleteIcon onClick={handleDeleteUser(user.id)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <div className="col-md-12 col-md-offset-5">
              <Pagination
                style={{ width: "40rem", marginTop: "2rem" }}
                count={totalPage}
                page={pageNumber}
                onChange={handleChangePageNumber}
              />
            </div>
          </Table>
        )}
      </div>
    </div>
  );
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete,
};

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
