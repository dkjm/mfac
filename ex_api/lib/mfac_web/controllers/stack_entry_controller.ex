defmodule MfacWeb.StackEntryController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.StackEntry
  import Timex 

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    stack_entries = Meetings.list_stack_entries()
    render(conn, "index.json", stack_entries: stack_entries)
  end


  #TODO(ja): these params should be changed back to the default. 
  # swapping now to get working with existing client app
  def create(conn, stack_entry_params) do
    with {:ok, %StackEntry{} = stack_entry} <- Meetings.create_stack_entry(Map.put(stack_entry_params, "opened_at", Timex.now)) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", stack_entry_path(conn, :show, stack_entry))
      |> render("show.json", stack_entry: stack_entry)
    end
  end

  def show(conn, %{"id" => id}) do
    stack_entry = Meetings.get_stack_entry!(id)
    render(conn, "show.json", stack_entry: stack_entry)
  end

  def update(conn, %{"id" => id, "stack_entry" => stack_entry_params}) do
    stack_entry = Meetings.get_stack_entry!(id)

    with {:ok, %StackEntry{} = stack_entry} <- Meetings.update_stack_entry(stack_entry, stack_entry_params) do
      render(conn, "show.json", stack_entry: stack_entry)
    end
  end

  def delete(conn, %{"id" => id}) do
    stack_entry = Meetings.get_stack_entry!(id)
    with {:ok, %StackEntry{}} <- Meetings.delete_stack_entry(stack_entry) do
      send_resp(conn, :no_content, "")
    end
  end
end
