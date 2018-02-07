defmodule MfacWeb.InvitationView do
  use MfacWeb, :view
  alias MfacWeb.InvitationView

  def render("index.json", %{invitations: invitations}) do
    %{data: render_many(invitations, InvitationView, "invitation.json")}
  end

  def render("show.json", %{invitation: invitation}) do
    render_one(invitation, InvitationView, "invitation.json")
  end

  def render("invitation.json", %{invitation: invitation}) do
    %{id: invitation.id,
      inserted_at: invitation.inserted_at,
      updated_at: invitation.updated_at,
      accepted_at: invitation.accepted_at,
      declined_at: invitation.declined_at,
      status: invitation.status,
      version: invitation.version,
      meeting: render_one(invitation.meeting, MfacWeb.MeetingView, "meeting.json"),
      inviter: render_one(invitation.inviter, MfacWeb.UserView, "user_simple.json"),
      invitee: render_one(invitation.invitee, MfacWeb.UserView, "user_simple.json"),

    }
  end
end
