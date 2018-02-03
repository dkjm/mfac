defmodule Mfac.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Accounts.User


  schema "users" do
    field :first_name, :string
    field :is_active, :boolean, default: false
    field :last_name, :string
    field :middle_name, :string
    field :suffix, :string

    timestamps()
  end

  @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:first_name, :last_name, :middle_name, :suffix, :is_active])
    |> validate_required([:first_name, :last_name, :is_active])
  end
end
