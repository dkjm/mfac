defmodule MfacWeb.AmendmentView do
  use MfacWeb, :view
  alias MfacWeb.AmendmentView

  def render("index.json", %{amendments: amendments}) do
    %{data: render_many(amendments, AmendmentView, "amendment.json")}
  end

  def render("show.json", %{amendment: amendment}) do
    %{data: render_one(amendment, AmendmentView, "amendment.json")}
  end

  def render("amendment.json", %{amendment: amendment}) do
    %{id: amendment.id,
      title: amendment.title,
      description: amendment.description,
      version: amendment.version,
      decided_at: amendment.decided_at,
      deleted_at: amendment.deleted_at,
      meeting_action: amendment.meeting_action,
      status: amendment.status}
  end
end
