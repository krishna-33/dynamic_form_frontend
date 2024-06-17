import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import { useGetFormsQuery } from "../../redux/apiSlice";
import Loader from "../../common/loader";
import NoDataDiv from "../../common/nodatadiv";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";

const columns = [
  "Title",
  "Decription",
  "CreatedAt",
  "Responses",
  "OpenCounts",
  "Actions",
];
const Row = ({ row, handleNavigate, loggedInUser }) => {
  const [isOpen, setISOpen] = useState(false);
  let responses = row.responses.map(({ user, updatedAt, ...obj }) => ({
    name: `${user?.fname} ${user?.lname}`,
    response: { ...obj },
  }));
  responses = responses.map(({ response, ...obj }) => {

    const transformedResponse = response.response.map((i) => ({
        question: i.question,
        answer: i.answer
    }));

    return { ...obj, response: transformedResponse };
});

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={`${row.id}-${row.title}`}
      >
        {loggedInUser.type == "admin" ? (
          <TableCell padding="checkbox">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setISOpen(!isOpen)}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        ) : null}
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{moment(row.createdAt).format("MM/DD/YYYY")}</TableCell>
        <TableCell>{row.responses?.length}</TableCell>
        <TableCell>{row.openCounts}</TableCell>
        <TableCell>
          <Button onClick={() => handleNavigate(`${row?.id}`)}>
            Add Response
          </Button>
        </TableCell>
      </TableRow>
      <TableRow
        className={`expandable-row ${!isOpen ? "border-bottom-none" : ""}`}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Table size="small" aria-label="cameras">
                <TableHead>
                  <TableRow>
                    <TableCell>Responses({row.responses?.length})</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: "break-spaces" }}>
                      {JSON.stringify(responses, undefined, "\t")}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
export default function List() {
  const loggedInUser = useSelector(selectUser);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const authToken = useSelector((state) => state?.auth?.authToken);
  const { data, isLoading, refetch } = useGetFormsQuery({
    endpoint: "forms",
    authToken,
  });
  useEffect(() => {
    refetch();
  }, [refetch, authToken]);

  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleNavigate = (id) => navigate(`/forms/${id}`);
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Loader open={isLoading} />
      {loggedInUser?.type == "admin" ? (
        <Stack direction={"row"} alignItems={"end"} justifyContent={"flex-end"}>
          <Button variant="contained" onClick={() => navigate("/forms/new")}>
            New Form
          </Button>
        </Stack>
      ) : null}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {loggedInUser?.type == "admin" ? (
                <TableCell style={{ minWidth: 30 }} />
              ) : null}
              {columns.map((column, index) => (
                <TableCell
                  key={`${column.name}-${index}`}
                  style={{ minWidth: 170 }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.length > 0 &&
              data?.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <Row
                      key={row.id}
                      row={row}
                      handleNavigate={handleNavigate}
                      loggedInUser={loggedInUser}
                    />
                  );
                })}
          </TableBody>
        </Table>
        {!data?.data.length ? <NoDataDiv /> : null}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={data?.data?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
