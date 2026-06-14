import { useEffect, useMemo, useState } from 'react'
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../api/user'
import Icon from '../components/Icon.jsx'
import Toast from '../components/Toast.jsx'

const emptyForm = { id: '', firstName: '', lastName: '' }

export default function Users() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [query, setQuery] = useState('')
  const [lookupId, setLookupId] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return users
    return users.filter((user) =>
      `${user.firstName || ''} ${user.lastName || ''} ${user._id || ''}`.toLowerCase().includes(term),
    )
  }, [query, users])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const { data } = await getUsers()
      setUsers(data.users || [])
    } catch {
      setToast({ type: 'error', message: 'Could not load users from the API.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submitUser = async (event) => {
    event.preventDefault()
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()

    if (!firstName) {
      setToast({ type: 'error', message: 'First name is required.' })
      return
    }

    try {
      if (form.id) {
        await updateUser({ id: form.id, firstName, lastName })
        setToast({ type: 'success', message: 'User updated successfully.' })
      } else {
        await createUser({ firstName, lastName })
        setToast({ type: 'success', message: 'User created successfully.' })
      }
      setForm(emptyForm)
      loadUsers()
    } catch {
      setToast({ type: 'error', message: 'The save failed. Check the user ID and backend connection.' })
    }
  }

  const editUser = (user) => {
    setForm({
      id: user._id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeUser = async (user) => {
    const confirmed = window.confirm(`Delete ${user.firstName || 'this user'}?`)
    if (!confirmed) return

    try {
      await deleteUser({ id: user._id })
      setToast({ type: 'success', message: 'User deleted.' })
      loadUsers()
    } catch {
      setToast({ type: 'error', message: 'Could not delete this user.' })
    }
  }

  const findUser = async () => {
    if (!lookupId.trim()) return
    try {
      const { data } = await getUser({ id: lookupId.trim() })
      setFoundUser(data.user)
      setToast({ type: 'success', message: 'User found.' })
    } catch {
      setFoundUser(null)
      setToast({ type: 'error', message: 'No user found for that ID or first name.' })
    }
  }

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Toast toast={toast} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Icon name="users" className="text-indigo-500" />
            User Management
          </h1>
          <p className="text-slate-400 mt-1">Manage your application users and database records.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <form className="lg:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6" onSubmit={submitUser}>
          <div className="grid md:grid-cols-2 gap-6">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-300 ml-1">First Name</span>
              <input 
                name="firstName" 
                value={form.firstName} 
                onChange={updateField} 
                required 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="Ada" 
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-300 ml-1">Last Name</span>
              <input 
                name="lastName" 
                value={form.lastName} 
                onChange={updateField} 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                placeholder="Lovelace" 
              />
            </label>
          </div>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-300 ml-1">Document ID</span>
            <input 
              name="id" 
              value={form.id} 
              onChange={updateField} 
              disabled 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
              placeholder="Auto-generated by MongoDB" 
            />
          </label>
          <div className="flex gap-4 pt-2">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all" type="submit">
              {form.id ? 'Save changes' : 'Create user'}
            </button>
            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all" type="button" onClick={() => setForm(emptyForm)}>
              Clear
            </button>
          </div>
        </form>

        <div className="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white">Find user</h2>
          <div className="relative group">
            <input 
              value={lookupId} 
              onChange={(event) => setLookupId(event.target.value)} 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="User ID or name" 
            />
            <button onClick={findUser} className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 transition-colors">
              <Icon name="search" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            All Records
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono">{filteredUsers.length}</span>
          </h2>
          <div className="flex gap-2">
            <input 
              value={query} 
              onChange={(event) => setQuery(event.target.value)} 
              placeholder="Filter users..."
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button onClick={loadUsers} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400">
              <Icon name="refresh" size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Profile Info</th>
                <th className="px-6 py-4">Database ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{user.firstName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.lastName || '—'}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-500 font-mono">{user._id}</code>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-indigo-400 hover:text-indigo-300 text-sm font-bold" onClick={() => editUser(user)}>Edit</button>
                      <button className="text-rose-500 hover:text-rose-400 text-sm font-bold" onClick={() => removeUser(user)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filteredUsers.length && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
