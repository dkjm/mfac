defmodule MfacWeb.ParticipantView do
  use MfacWeb, :view
  alias MfacWeb.ParticipantView

  def render("index.json", %{participants: participants}) do
    %{data: render_many(participants, ParticipantView, "participant.json")}
  end

  def render("show.json", %{participant: participant}) do
    %{data: render_one(participant, ParticipantView, "participant.json")}
  end

  def render("participant.json", %{participant: participant}) do
    %{id: participant.id,
      status: participant.status,
      joined_at: participant.joined_at,
      left_at: participant.left_at,
      version: participant.version}
  end
end
