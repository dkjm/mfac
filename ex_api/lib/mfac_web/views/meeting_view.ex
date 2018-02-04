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
      agenda_items: render_many(meeting.agenda_items, MfacWeb.AgendaItemView, "meeting_update_agenda_item.json"),
      invitations: render_many(meeting.invitations, MfacWeb.InvitationView, "invitation.json"),
      participants: render_many(meeting.participants, MfacWeb.ParticipantView, "participant.json")
    }
  end
end
