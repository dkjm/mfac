defmodule MfacWeb.MeetingController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Meeting

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    user = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    IO.inspect(user, label: "USER")
    meetings = Meetings.list_user_meetings(user.id)
    render(conn, "index.json", meetings: meetings)
  end

  def show(conn, %{"id" => id}) do
    meeting = Meetings.get_meeting!(id)
    render(conn, "show.json", meeting: meeting)
  end

  # Must return response with meeting_id
  # from this endpoint, so that client
  # can navigate to correct url.  But
  # complete data is actually sent via
  # socket connection and not in this response
  def create(conn, %{"meeting" => meeting_params}) do
    # get user from conn and merge params
    user = Mfac.Accounts.Guardian.Plug.current_resource(conn)
    params = Map.put(meeting_params, "user_id", user.id)
    with {:ok, %Meeting{} = meeting} <- Meetings.create_meeting(params) do
      conn
      |> put_status(:created)
      |> render(MfacWeb.MeetingView, "show.json", %{meeting: meeting})
    end
  end

  def update(conn, %{"id" => id, "meeting" => meeting_params}) do
    meeting = Meetings.get_meeting!(id)

    with {:ok, %Meeting{} = meeting} <- Meetings.update_meeting(meeting, meeting_params) do
      conn
      |> put_status(:ok)
      |> send_resp(:no_content, "")
    end
  end

  def delete(conn, %{"id" => id}) do
    meeting = Meetings.get_meeting!(id)
    with {:ok, %Meeting{}} <- Meetings.delete_meeting(meeting) do
      send_resp(conn, :no_content, "")
    end
  end
end
