defmodule MfacWeb.AgendaItemView do
  use MfacWeb, :view
  alias MfacWeb.AgendaItemView

  def render("index.json", %{agendaitems: agendaitems}) do
    %{data: render_many(agendaitems, AgendaItemView, "agenda_item.json")}
  end

  def render("show.json", %{agenda_item: agenda_item}) do
    agenda_item = Map.put(agenda_item, "votes", %{up: 0, down: 0, meh: 0, user_vote: nil})
    render_one(agenda_item, AgendaItemView, "agenda_item.json")
  end

  # def render("agenda_item.json", %{agenda_item: agenda_item}) do
  #   %{id: agenda_item.id,
  #     title: agenda_item.title,
  #     body: agenda_item.body,
  #     status: agenda_item.status,
  #     allotted_duration: agenda_item.allotted_duration,
  #     version: agenda_item.version
  #   }
  # end

  def render("agenda_item.json", data) do
    %{id: data.id,
      title: data.title,
      body: data.body,
      status: data.status,
      allotted_duration: data.allotted_duration,
      version: data.version,
      votes: data.votes,
      owner: render_one(data.owner, MfacWeb.UserView, "user.json"),
      stack_entries: render_many(data.stack_entries, MfacWeb.StackEntryView, "stack_entry.json")
    }
  end

  def render("meeting_update_agenda_item.json", %{agenda_item: agenda_item}) do
    %{id: agenda_item.id,
      title: agenda_item.title,
      body: agenda_item.body,
      status: agenda_item.status,
      allotted_duration: agenda_item.allotted_duration,
      version: agenda_item.version,
      votes: agenda_item.votes,
      owner: render_one(agenda_item.owner, MfacWeb.UserView, "user.json"),
      stack_entries: render_many(agenda_item.stack_entries, MfacWeb.StackEntryView, "stack_entry.json")
    }
  end

  def render("agenda_item_with_votes.json", data) do 
    %{id: data.id,
      title: data.title,
      body: data.body,
      status: data.status,
      allotted_duration: data.allotted_duration,
      version: data.version,
      votes: format_votes(data.votes),
      owner: render_one(data.owner, MfacWeb.UserView, "user.json"),
      stack_entries: render_many(data.stack_entries, MfacWeb.StackEntryView, "stack_entry.json")
    }
  end

  defp format_votes(votes) do
    result = %{
      up: 0, 
      down: 0, 
      meh: 0, 
    }
    Enum.reduce(votes, result, fn(vote, acc) -> 
      case vote.vote_type do
        "UP" -> 
          Map.put(acc, :up, Map.get(acc, :up) + 1)
        "DOWN" ->
          Map.put(acc, :down, Map.get(acc, :down) + 1)
        "MEH" ->
          Map.put(acc, :meh, Map.get(acc, :meh) + 1)
      end  
    end)
  end
end
