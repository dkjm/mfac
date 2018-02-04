defmodule MfacWeb.StackEntryView do
  use MfacWeb, :view
  alias MfacWeb.StackEntryView

  def render("index.json", %{stack_entries: stack_entries}) do
    %{data: render_many(stack_entries, StackEntryView, "stack_entry.json")}
  end

  def render("show.json", %{stack_entry: stack_entry}) do
    %{data: render_one(stack_entry, StackEntryView, "stack_entry.json")}
  end

  def render("stack_entry.json", %{stack_entry: stack_entry}) do
    %{id: stack_entry.id,
      status: stack_entry.status,
      allotted_duration: stack_entry.allotted_duration,
      version: stack_entry.version,
      opened_at: stack_entry.opened_at,
      closed_at: stack_entry.closed_at}
  end
end
