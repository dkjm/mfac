defmodule MfacWeb.StackView do
  use MfacWeb, :view
  alias MfacWeb.StackView

  def render("index.json", %{stack: stack}) do
    %{data: render_many(stack, StackView, "stack.json")}
  end

  def render("show.json", %{stack: stack}) do
    %{data: render_one(stack, StackView, "stack.json")}
  end

  def render("stack.json", %{stack: stack}) do
    %{id: stack.id,
      version: stack.version}
  end
end
