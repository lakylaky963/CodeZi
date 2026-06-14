import { useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../api/user";
import Icon from "../components/Icon.jsx";
import Toast from "../components/Toast.jsx";

const emptyForm = { id: "", firstName: "", lastName: "" };

function getInitials(user) {
  const first = user?.firstName?.trim()?.[0] || "U";
  const last = user?.lastName?.trim()?.[0] || "";
  return `${first}${last}`.toUpperCase();
}

function isScoreRecord(user) {
  return /Score\s+\d+/i.test(user?.lastName || "");
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState("");

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      [user.firstName, user.lastName, user._id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch {
      setToast({ type: "error", message: "Could not load users from the API." });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const submitUser = async (event) => {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!firstName) {
      setToast({ type: "error", message: "firstName is required by the MongoDB schema." });
      return;
    }

    setIsSaving(true);
    try {
      if (form.id) {
        await updateUser({ id: form.id, firstName, lastName });
        setToast({ type: "success", message: "User updated successfully." });
      } else {
        await createUser({ firstName, lastName });
        setToast({ type: "success", message: "User created successfully." });
      }

      resetForm();
      await loadUsers();
    } catch {
      setToast({ type: "error", message: "Save failed. Check the user ID and backend connection." });
    } finally {
      setIsSaving(false);
    }
  };

  const editUser = (user) => {
    setForm({
      id: user?._id || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeUser = async (user) => {
    if (!user?._id) return;
    const confirmed = window.confirm(`Delete ${user.firstName || "this user"}?`);
    if (!confirmed) return;

    setIsDeleting(user._id);
    try {
      await deleteUser({ id: user._id });
      setToast({ type: "success", message: "User deleted." });
      if (form.id === user._id) resetForm();
      await loadUsers();
    } catch {
      setToast({ type: "error", message: "Could not delete this user." });
    } finally {
      setIsDeleting("");
    }
  };

  const findUser = async () => {
    const id = lookupId.trim();
    if (!id) {
      setToast({ type: "error", message: "Enter a MongoDB id or firstName to look up." });
      return;
    }

    try {
      const { data } = await getUser({ id });
      setFoundUser(data?.user || null);
      setToast({ type: "success", message: "User found." });
    } catch {
      setFoundUser(null);
      setToast({ type: "error", message: "No user found for that id or firstName." });
    }
  };

  return (
    <section className="space-y-8">
      <Toast toast={toast} />

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
            <Icon name="users" size={15} />
            User Operations
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            User Management Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Manage the small MongoDB user schema safely. Game scores still use firstName as player name and lastName as encoded score metadata.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:translate-y-0 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        >
          <Icon name="refresh" size={17} />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <form
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          onSubmit={submitUser}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                {form.id ? "Edit Record" : "Create Record"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Only firstName and lastName are sent to the existing API.
              </p>
            </div>
            {form.id ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 dark:bg-amber-400/10 dark:text-amber-200">
                editing
              </span>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              First name
              <input
                name="firstName"
                value={form.firstName}
                onChange={updateField}
                required
                placeholder="Ada"
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              Last name / score metadata
              <input
                name="lastName"
                value={form.lastName}
                onChange={updateField}
                placeholder="Lovelace or Score 240 | Memory Match | ..."
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>

          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            Document id
            <input
              name="id"
              value={form.id}
              disabled
              placeholder="Auto-generated by MongoDB"
              className="min-h-11 cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 text-sm font-black text-white shadow-lg shadow-cyan-700/20 transition-all hover:-translate-y-0.5 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name={form.id ? "check" : "spark"} size={17} />
              {isSaving ? "Saving..." : form.id ? "Save Changes" : "Create User"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-800 transition-all hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:translate-y-0 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <Icon name="x" size={17} />
              Clear
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Lookup</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The backend accepts a MongoDB ObjectId, or a firstName fallback for quick score updates.
          </p>

          <div className="mt-5 flex gap-2">
            <input
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") findUser();
              }}
              placeholder="ObjectId or firstName"
              className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="button"
              onClick={findUser}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-950 text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:translate-y-0 dark:bg-cyan-700 dark:hover:bg-cyan-600"
              aria-label="Find user"
            >
              <Icon name="search" size={18} />
            </button>
          </div>

          {foundUser ? (
            <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/10">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-700 text-sm font-black text-white">
                  {getInitials(foundUser)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-950 dark:text-white">{foundUser.firstName}</p>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-300">{foundUser.lastName || "No lastName value"}</p>
                </div>
              </div>
              <code className="mt-3 block truncate rounded-lg bg-white px-3 py-2 text-xs text-slate-500 dark:bg-slate-950">
                {foundUser._id}
              </code>
            </div>
          ) : null}
        </aside>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="flex items-center gap-3 text-lg font-black text-slate-950 dark:text-white">
              All Records
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {filteredUsers.length}
              </span>
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search by name, score metadata, or document id.
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Icon name="search" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter records..."
              className="min-h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-3 p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : filteredUsers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">lastName payload</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Document id</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          {getInitials(user)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-black text-slate-950 dark:text-white">{user.firstName || "Untitled"}</p>
                          <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">Mongo user document</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {user.lastName || "No lastName value"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          isScoreRecord(user)
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {isScoreRecord(user) ? "score" : "profile"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="block max-w-[210px] truncate rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                        {user._id}
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editUser(user)}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 active:scale-95 dark:border-slate-800 dark:text-slate-300"
                          aria-label={`Edit ${user.firstName || "user"}`}
                          title="Edit"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeUser(user)}
                          disabled={isDeleting === user._id}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-rose-300 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-300 dark:hover:text-rose-300"
                          aria-label={`Delete ${user.firstName || "user"}`}
                          title="Delete"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Icon name={query ? "search" : "database"} size={26} />
              </span>
              <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                {query ? "No matching records" : "No users yet"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {query
                  ? "Try a different name, score value, or MongoDB id."
                  : "Create the first record above. The table will update after the API responds."}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
