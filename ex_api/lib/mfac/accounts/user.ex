defmodule Mfac.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Mfac.Accounts.User


  schema "users" do
    field :first_name, :string
    field :is_active, :boolean, default: false
    field :last_name, :string
    field :middle_name, :string
    field :user_name, :string
    field :hashed_password, :string
    field :password, :string, virtual: true
    has_many :invitations, Mfac.Meetings.Invitation, foreign_key: :invitee_id

    timestamps()
  end

  @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:first_name, :last_name, :middle_name, :is_active, :hashed_password, :user_name])
    |> validate_required([:first_name, :last_name, :is_active])
  end

  defp hash_password(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(changeset, :hashed_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        changeset
    end
  end

  def registration_changeset(struct, params) do
    struct
    |> changeset(params)
    |> cast(params, ~w(password)a, [])
    |> validate_length(:password, min: 6, max: 100)
    |> hash_password
  end
end
