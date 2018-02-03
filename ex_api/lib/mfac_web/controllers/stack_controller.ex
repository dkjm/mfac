defmodule MfacWeb.StackController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Stack

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    stack = Meetings.list_stacks()
    render(conn, "index.json", stack: stack)
  end

  def create(conn, %{"stack" => stack_params}) do
    with {:ok, %Stack{} = stack} <- Meetings.create_stack(stack_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", stack_path(conn, :show, stack))
      |> render("show.json", stack: stack)
    end
  end

  def show(conn, %{"id" => id}) do
    stack = Meetings.get_stack!(id)
    render(conn, "show.json", stack: stack)
  end

  def update(conn, %{"id" => id, "stack" => stack_params}) do
    stack = Meetings.get_stack!(id)

    with {:ok, %Stack{} = stack} <- Meetings.update_stack(stack, stack_params) do
      render(conn, "show.json", stack: stack)
    end
  end

  def delete(conn, %{"id" => id}) do
    stack = Meetings.get_stack!(id)
    with {:ok, %Stack{}} <- Meetings.delete_stack(stack) do
      send_resp(conn, :no_content, "")
    end
  end
end
