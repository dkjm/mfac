defmodule MfacWeb.AgendaItemVoteView do
  use MfacWeb, :view
  alias MfacWeb.AgendaItemVoteView

  def render("index.json", %{agendaitemvotes: agendaitemvotes}) do
    %{data: render_many(agendaitemvotes, AgendaItemVoteView, "agenda_item_vote.json")}
  end

  def render("show.json", %{agenda_item_vote: agenda_item_vote}) do
    %{data: render_one(agenda_item_vote, AgendaItemVoteView, "agenda_item_vote.json")}
  end

  def render("agenda_item_vote.json", %{agenda_item_vote: agenda_item_vote}) do
    %{id: agenda_item_vote.id,
      vote_type: agenda_item_vote.vote_type,
      version: agenda_item_vote.version}
  end
end
