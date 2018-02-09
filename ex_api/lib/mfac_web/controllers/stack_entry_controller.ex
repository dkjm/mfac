defmodule MfacWeb.StackEntryController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.StackEntry
  import Timex 
  import Ecto.Query
  alias Mfac.Repo

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    stack_entries = Meetings.list_stack_entries()
    render(conn, "index.json", stack_entries: stack_entries)
  end

  # TODO(MP 2/8): move queries and utilities
  # (e.g. checks to see if user is on stack)
  # to a single location helper file
  def create(conn, %{"agenda_item_id" => agenda_item_id}) do
    requester = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    stack_entries = Repo.all(from s in StackEntry, where: s.agenda_item_id == ^agenda_item_id)
    user_entries = Enum.filter(stack_entries, fn(s) -> s.user_id == requester.id end)
    stack_entry = List.first(user_entries)
    # if user on stack return empty response
    # else create stack entry
    if stack_entry != nil do
      send_resp(conn, :no_content, "")
    else
      params = %{
        user_id: requester.id,
        agenda_item_id: agenda_item_id,
      }
      with {:ok, %StackEntry{} = stack_entry} <- Meetings.create_stack_entry(params) do
        conn
        |> put_status(:created)
        |> send_resp(:no_content, "")
      end
    end
  end

  def show(conn, %{"id" => id}) do
    stack_entry = Meetings.get_stack_entry!(id)
    render(conn, "show.json", stack_entry: stack_entry)
  end

  # MP 2/8 - Update is not implemented.  
  # Don't think there's a need for it 
  # right now.  Just
  # create and delete actions are needed
  def update(conn, %{"id" => id, "stack_entry" => stack_entry_params}) do
    stack_entry = Meetings.get_stack_entry!(id)

    with {:ok, %StackEntry{} = stack_entry} <- Meetings.update_stack_entry(stack_entry, stack_entry_params) do
      render(conn, "show.json", stack_entry: stack_entry)
    end
  end

  # TODO(MP 2/8): move queries and utilities
  # (e.g. checks to see if user is on stack)
  # to a single location helper file
  def delete(conn, %{"agenda_item_id" => agenda_item_id}) do
    requester = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    stack_entries = Repo.all(from s in StackEntry, where: s.agenda_item_id == ^agenda_item_id)
    user_entries = Enum.filter(stack_entries, fn(s) -> s.user_id == requester.id end)
    stack_entry = List.first(user_entries)
    # if user not on stack return empty response
    # else delete stack entry
    if stack_entry == nil do
      send_resp(conn, :no_content, "")
    else
      with {:ok, %StackEntry{}} <- Meetings.delete_stack_entry(stack_entry) do
        send_resp(conn, :no_content, "")
      end
    end
    
  end
end
