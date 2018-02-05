defmodule MfacWeb.InvitationController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Invitation

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    invitations = Meetings.list_invitations()
    render(conn, "index.json", invitations: invitations)
  end

  def create(conn, %{"invitation" => invitation_params}) do
    with {:ok, %Invitation{} = invitation} <- Meetings.create_invitation(invitation_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", invitation_path(conn, :show, invitation))
      |> render("show.json", invitation: invitation)
    end
  end

  def show(conn, %{"id" => id}) do
    invitation = Meetings.get_invitation!(id)
    render(conn, "show.json", invitation: invitation)
  end

  def update(conn, %{"id" => id, "invitation" => invitation_params}) do
    invitation = Meetings.get_invitation!(id)

    with {:ok, %Invitation{} = invitation} <- Meetings.update_invitation(invitation, invitation_params) do
      render(conn, "show.json", invitation: invitation)
    end
  end

  def delete(conn, %{"id" => id}) do
    invitation = Meetings.get_invitation!(id)
    with {:ok, %Invitation{}} <- Meetings.delete_invitation(invitation) do
      send_resp(conn, :no_content, "")
    end
  end
end
