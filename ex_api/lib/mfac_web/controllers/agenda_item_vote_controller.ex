defmodule MfacWeb.AgendaItemVoteController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.AgendaItemVote
  alias Mfac.Repo
  import Ecto.Query

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    agendaitemvotes = Meetings.list_agenda_item_votes()
    render(conn, "index.json", agendaitemvotes: agendaitemvotes)
  end

  def create(conn, %{"agenda_item_id" => agenda_item_id, "vote_type" => vote_type}) do
    requester = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    params = %{
      agenda_item_id: String.to_integer(agenda_item_id),
      user_id: requester.id,
      vote_type: vote_type,
    }
    #IO.inspect(params, label: "PARAMS")
    user_votes = Repo.all(from v in AgendaItemVote, where: v.user_id == ^requester.id and v.agenda_item_id == ^agenda_item_id)
    user_vote = List.first(user_votes)
    #IO.inspect(user_vote, label: "USER VOTE")
    cond do
      # if user has not voted for this 
      # agenda_item, make new vote 
      user_vote == nil ->
        #IO.puts("user vote is nil")
        with {:ok, %AgendaItemVote{} = user_vote} <- Meetings.create_agenda_item_vote(params) do
          conn
          |> put_status(:created)
          |> send_resp(:no_content, "")
        end
      # if user's vote.vote_type is the 
      # same as in request, delete vote
      user_vote.vote_type == params.vote_type ->
        #IO.puts("user vote type is same, deleting")
        with {:ok, %AgendaItemVote{}} <- Meetings.delete_agenda_item_vote(user_vote) do
          conn
          |> put_status(:ok)
          |> send_resp(:no_content, "")
        end
      # if user's vote.vote_type is different 
      # than request, change vote.vote_type
      user_vote.vote_type != params.vote_type ->
        #IO.puts("user vote dif is same, changing")
        with {:ok, %AgendaItemVote{} = updated_vote} <- Meetings.update_agenda_item_vote(user_vote, params) do
          conn
          |> put_status(:ok)
          |> send_resp(:no_content, "")
        end
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
