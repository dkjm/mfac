defmodule MfacWeb.InvitationView do
  use MfacWeb, :view
  alias MfacWeb.InvitationView

  def render("index.json", %{invitations: invitations}) do
    %{data: render_many(invitations, InvitationView, "invitation.json")}
  end

  def render("show.json", %{invitation: invitation}) do
    %{data: render_one(invitation, InvitationView, "invitation.json")}
  end

  def render("invitation.json", %{invitation: invitation}) do
    %{id: invitation.id,
      status: invitation.status,
      accepted_at: invitation.accepted_at,
      declined_at: invitation.declined_at,
      verion: invitation.verion}
  end
end
