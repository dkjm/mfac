defmodule MfacWeb.ProposalVoteController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Proposal
  alias Mfac.Meetings.Vote
  alias Mfac.Meetings.ProposalVote
  alias Mfac.Accounts.User
  alias Mfac.Repo
  import Ecto.Query

  action_fallback MfacWeb.FallbackController


  def create(conn, %{"proposal_id" => proposal_id, "value" => value}) do
    requester = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    proposal_id = String.to_integer(proposal_id)
    params = %{
      proposal_id: proposal_id,
      user_id: requester.id,
      value: value,
    }
    # proposal_vote_params = {
    #   proposal_id: proposal_id,
    #   vote_id: vote.id,
    # }
    #IO.inspect(params, label: "PARAMS")

    # result = Repo.all(from pv in ProposalVote, where: pv.proposal_id == ^proposal_id and pv.vote.user_id == ^requester.id) |> Repo.preload([:vote])
    query = 
      from pv in ProposalVote,
      left_join: v in Vote, on: v.id == pv.vote_id,
      where: pv.proposal_id == ^proposal_id and v.user_id == ^requester.id,
      preload: [
        vote: v,
      ]

    result = Repo.all(query)
    user_vote = List.first(result)

    cond do
      user_vote == nil ->
        with {:ok, %ProposalVote{} = user_vote} <- Meetings.create_proposal_vote(params) do
          send_resp(conn, 201, "")
        end
      user_vote.vote.value == value ->
        with {:ok, %ProposalVote{}} <- Meetings.delete_proposal_vote(user_vote) do
          send_resp(conn, 200, "")
        end
      user_vote.vote.value != value ->
        with {:ok, %ProposalVote{} = user_vote} <- Meetings.update_proposal_vote(user_vote, params) do
          send_resp(conn, 200, "")
        end
    end

    # if user_vote do
    #   # if value is same, delete. Update if different
    #   if user_vote.value == value do
        
    #   else

    #   end
    # else
    #   # create vote
    # end

    # result = Repo.all(from pv in ProposalVote, where: pv.proposal_id == ^proposal_id) |> Repo.preload([:vote])
    IO.inspect(result, label: "PV")
    send_resp(conn, 200, "")
  end

  def show(conn, %{"id" => id}) do
    agenda_item_vote = Meetings.get_agenda_item_vote!(id)
    render(conn, "show.json", agenda_item_vote: agenda_item_vote)
  end

end
