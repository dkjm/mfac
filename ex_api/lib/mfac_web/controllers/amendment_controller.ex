defmodule MfacWeb.AmendmentController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Amendment

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    amendments = Meetings.list_amendments()
    render(conn, "index.json", amendments: amendments)
  end

  def create(conn, %{"amendment" => amendment_params}) do
    with {:ok, %Amendment{} = amendment} <- Meetings.create_amendment(amendment_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", amendment_path(conn, :show, amendment))
      |> render("show.json", amendment: amendment)
    end
  end

  def show(conn, %{"id" => id}) do
    amendment = Meetings.get_amendment!(id)
    render(conn, "show.json", amendment: amendment)
  end

  def update(conn, %{"id" => id, "amendment" => amendment_params}) do
    amendment = Meetings.get_amendment!(id)

    with {:ok, %Amendment{} = amendment} <- Meetings.update_amendment(amendment, amendment_params) do
      render(conn, "show.json", amendment: amendment)
    end
  end

  def delete(conn, %{"id" => id}) do
    amendment = Meetings.get_amendment!(id)
    with {:ok, %Amendment{}} <- Meetings.delete_amendment(amendment) do
      send_resp(conn, :no_content, "")
    end
  end
end
