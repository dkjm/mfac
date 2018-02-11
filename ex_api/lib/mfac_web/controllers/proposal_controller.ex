defmodule MfacWeb.ProposalController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Proposal

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    proposals = Meetings.list_proposals()
    render(conn, "index.json", proposals: proposals)
  end

  def create(conn, %{"proposal" => proposal_params}) do
    with {:ok, %Proposal{} = proposal} <- Meetings.create_proposal(proposal_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", proposal_path(conn, :show, proposal))
      |> render("show.json", proposal: proposal)
    end
  end

  def show(conn, %{"id" => id}) do
    proposal = Meetings.get_proposal!(id)
    render(conn, "show.json", proposal: proposal)
  end

  def update(conn, %{"id" => id, "proposal" => proposal_params}) do
    proposal = Meetings.get_proposal!(id)

    with {:ok, %Proposal{} = proposal} <- Meetings.update_proposal(proposal, proposal_params) do
      render(conn, "show.json", proposal: proposal)
    end
  end

  def delete(conn, %{"id" => id}) do
    proposal = Meetings.get_proposal!(id)
    with {:ok, %Proposal{}} <- Meetings.delete_proposal(proposal) do
      send_resp(conn, :no_content, "")
    end
  end
end
