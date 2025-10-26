import { useEffect, useMemo, useState } from "react";
import { fetchUsers } from "../api/reqres";
import {
  Box, CircularProgress, MenuItem, Pagination, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, ToggleButton, ToggleButtonGroup, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("first_name"); 
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [domain, setDomain] = useState("all");
  const [firstLetter, setFirstLetter] = useState("all");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchUsers(page, perPage)
      .then((data) => {
        if (!active) return;
        setRows(data.data || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, perPage]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((u) => {
        const matchesQuery =
          q.length === 0 ||
          u.first_name.toLowerCase().includes(q) ||
          u.last_name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q);
        const matchesDomain =
          domain === "all" || u.email.toLowerCase().endsWith(`@${domain}`);
        const matchesFirst =
          firstLetter === "all" ||
          u.first_name.toLowerCase().startsWith(firstLetter.toLowerCase());
        return matchesQuery && matchesDomain && matchesFirst;
      })
      .sort((a, b) => {
        const av = String(a[sortKey]).toLowerCase();
        const bv = String(b[sortKey]).toLowerCase();
        if (av < bv) return sortOrder === "asc" ? -1 : 1;
        if (av > bv) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [rows, query, domain, firstLetter, sortKey, sortOrder]);

  const domains = useMemo(() => {
    const set = new Set();
    rows.forEach((u) => {
      const d = u.email.split("@")[1];
      if (d) set.add(d.toLowerCase());
    });
    return ["all", ...Array.from(set).sort()];
  }, [rows]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr", mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            select
            size="small"
            label="Sort by"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="first_name">First name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </TextField>

          <ToggleButtonGroup
            size="small"
            value={sortOrder}
            exclusive
            onChange={(_, v) => v && setSortOrder(v)}
          >
            <ToggleButton value="asc">
              <ArrowUpward fontSize="small" /> asc
            </ToggleButton>
            <ToggleButton value="desc">
              <ArrowDownward fontSize="small" /> desc
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            select
            size="small"
            label="Email domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {domains.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            size="small"
            label="First letter"
            placeholder="e.g. E"
            value={firstLetter === "all" ? "" : firstLetter}
            onChange={(e) =>
              setFirstLetter(e.target.value ? e.target.value[0] : "all")
            }
            sx={{ width: 120 }}
          />

          <TextField
            select
            size="small"
            label="Per page"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            sx={{ width: 120 }}
          >
            {[3, 6, 12].map((n) => (
              <MenuItem key={n} value={n}>
                {n}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Last name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center" style={{ color: "#d32f2f" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <img
                      src={u.avatar}
                      alt={`${u.first_name} ${u.last_name}`}
                      style={{ width: 36, height: 36, borderRadius: "50%" }}
                    />
                  </TableCell>
                  <TableCell>{u.first_name}</TableCell>
                  <TableCell>{u.last_name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${u.email}`}>{u.email}</a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
}
