defmodule MfacWeb.ProposalView do
  use MfacWeb, :view
  alias MfacWeb.ProposalView

  def render("index.json", %{proposals: proposals}) do
    %{data: render_many(proposals, ProposalView, "proposal.json")}
  end

  def render("show.json", %{proposal: proposal}) do
    %{data: render_one(proposal, ProposalView, "proposal.json")}
  end

  def render("proposal.json", %{proposal: proposal}) do
    %{id: proposal.id,
      title: proposal.title,
      description: proposal.description,
      status: proposal.status,
      version: proposal.version,
      decided_at: proposal.decided_at,
      meeting_action: proposal.meeting_action}
  end
end
