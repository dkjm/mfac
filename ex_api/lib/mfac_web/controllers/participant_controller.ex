defmodule MfacWeb.ParticipantController do
  use MfacWeb, :controller

  alias Mfac.Meetings
  alias Mfac.Meetings.Participant

  action_fallback MfacWeb.FallbackController

  def index(conn, _params) do
    participants = Meetings.list_participants()
    render(conn, "index.json", participants: participants)
  end

  def create(conn, %{"participant" => participant_params}) do
    with {:ok, %Participant{} = participant} <- Meetings.create_participant(participant_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", participant_path(conn, :show, participant))
      |> render("show.json", participant: participant)
    end
  end

  def show(conn, %{"id" => id}) do
    participant = Meetings.get_participant!(id)
    render(conn, "show.json", participant: participant)
  end

  def update(conn, %{"id" => id, "participant" => participant_params}) do
    participant = Meetings.get_participant!(id)

    with {:ok, %Participant{} = participant} <- Meetings.update_participant(participant, participant_params) do
      render(conn, "show.json", participant: participant)
    end
  end

  def delete(conn, %{"id" => id}) do
    participant = Meetings.get_participant!(id)
    with {:ok, %Participant{}} <- Meetings.delete_participant(participant) do
      send_resp(conn, :no_content, "")
    end
  end
end
