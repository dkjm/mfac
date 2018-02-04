defmodule MfacWeb.AgendaItemController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.AgendaItem

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    agendaitems = Meetings.list_agendaitems()
    render(conn, "index.json", agendaitems: agendaitems)
  end

  def create(conn, %{"agenda_item" => agenda_item_params}) do
    with {:ok, %AgendaItem{} = agenda_item} <- Meetings.create_agenda_item(agenda_item_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", agenda_item_path(conn, :show, Mfac.Repo.preload(agenda_item, :votes)))
      |> render("show.json", agenda_item: agenda_item)
    end
  end

  def show(conn, %{"id" => id}) do
    agenda_item = Meetings.get_agenda_item!(id)
    render(conn, "show.json", agenda_item: agenda_item)
  end

  def update(conn, %{"id" => id, "agenda_item" => agenda_item_params}) do
    agenda_item = Meetings.get_agenda_item!(id)

    with {:ok, %AgendaItem{} = agenda_item} <- Meetings.update_agenda_item(agenda_item, agenda_item_params) do
      render(conn, "show.json", agenda_item: agenda_item)
    end
  end

  def delete(conn, %{"id" => id}) do
    agenda_item = Meetings.get_agenda_item!(id)
    with {:ok, %AgendaItem{}} <- Meetings.delete_agenda_item(agenda_item) do
      send_resp(conn, :no_content, "")
    end
  end
end
