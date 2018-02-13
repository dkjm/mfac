defmodule MfacWeb.ProposalView do
  use MfacWeb, :view
  alias MfacWeb.ProposalView

  def render("index.json", %{proposals: proposals}) do
    %{data: render_many(proposals, ProposalView, "proposal.json")}
  end

  def render("show.json", %{proposal: proposal}) do
    render_one(proposal, ProposalView, "proposal.json")
  end

  def render("proposal.json", %{proposal: proposal}) do
    %{id: proposal.id,
      agenda_item_id: proposal.agenda_item_id,
      title: proposal.title,
      description: proposal.description,
      status: proposal.status,
      version: proposal.version,
      decided_at: proposal.decided_at,
      inserted_at: proposal.inserted_at,
      updated_at: proposal.updated_at,
      meeting_action: proposal.meeting_action,
      #owner: render_one(proposal.owner, MfacWeb.UserView, "user_simple.json")
    }
  end

  def render("proposal_with_votes.json", %{proposal: proposal}) do
    %{id: proposal.id,
      agenda_item_id: proposal.agenda_item_id,
      title: proposal.title,
      description: proposal.description,
      status: proposal.status,
      version: proposal.version,
      decided_at: proposal.decided_at,
      inserted_at: proposal.inserted_at,
      updated_at: proposal.updated_at,
      meeting_action: proposal.meeting_action,
      owner: render_one(proposal.owner, MfacWeb.UserView, "user_simple.json"),
      votes: render_many(proposal.votes, MfacWeb.VoteView, "vote_with_owner.json")
    }
  end
end
