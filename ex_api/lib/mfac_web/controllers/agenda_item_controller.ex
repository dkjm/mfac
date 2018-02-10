defmodule MfacWeb.AgendaItemController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.AgendaItem

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    agendaitems = Meetings.list_agenda_items()
    render(conn, "index.json", agendaitems: agendaitems)
  end

  def show(conn, %{"id" => id}) do
    agenda_item = Meetings.get_agenda_item!(id)
    render(conn, "show.json", agenda_item: agenda_item)
  end

  # NOTE(MP 2/7): Response is just 201, no data.
  # Data is sent in channel.  
  # See Meetings.create_agenda_item for details
  def create(conn, %{"agenda_item" => agenda_item_params}) do
    user = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    with {:ok, %AgendaItem{} = agenda_item} <- Meetings.create_agenda_item(Map.put(agenda_item_params, "user_id", user.id)) do
      conn
      |> put_status(:created)
      |> send_resp(:no_content, "")
    end
  end

  # NOTE(MP 2/7): Response is just 200, no data.
  # Data is sent in channel.  
  # See Meetings.update_agenda_item for details
  def update(conn, %{"id" => id, "agenda_item" => agenda_item_params}) do
    agenda_item = Meetings.get_agenda_item!(id)
    with {:ok, %AgendaItem{} = agenda_item} <- Meetings.update_agenda_item(agenda_item, agenda_item_params) do
      conn
      |> put_status(:ok)
      |> send_resp(:no_content, "")
    end
  end

  def delete(conn, %{"id" => id}) do
    agenda_item = Meetings.get_agenda_item!(id)
    with {:ok, %AgendaItem{}} <- Meetings.delete_agenda_item(agenda_item) do
      send_resp(conn, :no_content, "")
    end
  end
end
