defmodule MfacWeb.MeetingView do
  use MfacWeb, :view
  alias MfacWeb.MeetingView

  def render("index.json", %{meetings: meetings}) do
    render_many(meetings, MeetingView, "meeting.json")
  end

  def render("show.json", %{meeting: meeting}) do
    render_one(meeting, MeetingView, "meeting.json")
  end

  def render("meeting.json", %{meeting: meeting}) do
    %{id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      allotted_duration: meeting.allotted_duration,
      version: meeting.version}
  end

  def render("socket_meeting.json", %{meeting: meeting}) do
    %{
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      allotted_duration: meeting.allotted_duration,
      version: meeting.version,
      agenda_items: render_many(meeting.agenda_items, MfacWeb.AgendaItemView, "agenda_item.json")
    }
  end
end
