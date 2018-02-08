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
      version: meeting.version,
      inserted_at: meeting.inserted_at,
      updated_at: meeting.updated_at,
      ended_at: meeting.ended_at}
  end

  def render("socket_meeting.json", %{meeting: meeting}) do
    %{
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      allotted_duration: meeting.allotted_duration,
      version: meeting.version,
      inserted_at: meeting.inserted_at,
      updated_at: meeting.updated_at,
      ended_at: meeting.ended_at,
      agenda_items: render_many(meeting.agenda_items, MfacWeb.AgendaItemView, "meeting_update_agenda_item.json"),
      invitations: render_many(meeting.invitations, MfacWeb.InvitationView, "invitation.json"),
      participants: render_many(meeting.participants, MfacWeb.ParticipantView, "participant.json"),
      owner: render_one(meeting.owner, MfacWeb.UserView, "user_simple.json")
    }
  end

  def render("socket_meeting_with_user_vote.json", %{meeting: meeting}) do
    %{
      id: meeting.id,
      title: meeting.title,
      description: meeting.description,
      allotted_duration: meeting.allotted_duration,
      version: meeting.version,
      inserted_at: meeting.inserted_at,
      updated_at: meeting.updated_at,
      ended_at: meeting.ended_at,
      agenda_items: render_many(meeting.agenda_items, MfacWeb.AgendaItemView, "agenda_item_with_user_vote.json"),
      invitations: render_many(meeting.invitations, MfacWeb.InvitationView, "invitation.json"),
      participants: render_many(meeting.participants, MfacWeb.ParticipantView, "participant.json"),
      owner: render_one(meeting.owner, MfacWeb.UserView, "user_simple.json")
    }
  end
end
