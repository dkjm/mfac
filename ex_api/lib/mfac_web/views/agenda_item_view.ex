defmodule MfacWeb.AgendaItemView do
  use MfacWeb, :view
  alias MfacWeb.AgendaItemView

  def render("index.json", %{agendaitems: agendaitems}) do
    %{data: render_many(agendaitems, AgendaItemView, "agenda_item.json")}
  end

  def render("show.json", %{agenda_item: agenda_item}) do
    %{data: render_one(agenda_item, AgendaItemView, "agenda_item.json")}
  end

  def render("agenda_item.json", %{agenda_item: agenda_item}) do
    %{id: agenda_item.id,
      title: agenda_item.title,
      body: agenda_item.body,
      status: agenda_item.status,
      allotted_duration: agenda_item.allotted_duration,
      version: agenda_item.version,
      votes: render_many(agenda_item.votes, MfacWeb.AgendaItemVoteView, "agenda_item_vote.json")
    }
  end
end
