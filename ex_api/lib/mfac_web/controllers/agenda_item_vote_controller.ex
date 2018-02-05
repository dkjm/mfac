defmodule MfacWeb.AgendaItemVoteController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.AgendaItemVote

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    agendaitemvotes = Meetings.list_agendaitemvotes()
    render(conn, "index.json", agendaitemvotes: agendaitemvotes)
  end

  def create(conn, %{"agenda_item_vote" => agenda_item_vote_params}) do
    with {:ok, %AgendaItemVote{} = agenda_item_vote} <- Meetings.create_agenda_item_vote(agenda_item_vote_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", agenda_item_vote_path(conn, :show, agenda_item_vote))
      |> render("show.json", agenda_item_vote: agenda_item_vote)
    end
  end

  def show(conn, %{"id" => id}) do
    agenda_item_vote = Meetings.get_agenda_item_vote!(id)
    render(conn, "show.json", agenda_item_vote: agenda_item_vote)
  end

  def update(conn, %{"id" => id, "agenda_item_vote" => agenda_item_vote_params}) do
    agenda_item_vote = Meetings.get_agenda_item_vote!(id)

    with {:ok, %AgendaItemVote{} = agenda_item_vote} <- Meetings.update_agenda_item_vote(agenda_item_vote, agenda_item_vote_params) do
      render(conn, "show.json", agenda_item_vote: agenda_item_vote)
    end
  end

  def delete(conn, %{"id" => id}) do
    agenda_item_vote = Meetings.get_agenda_item_vote!(id)
    with {:ok, %AgendaItemVote{}} <- Meetings.delete_agenda_item_vote(agenda_item_vote) do
      send_resp(conn, :no_content, "")
    end
  end
end
