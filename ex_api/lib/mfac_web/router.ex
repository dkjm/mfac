defmodule MfacWeb.Router do
  use MfacWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_auth do
    plug :accepts, ["json"]
    plug Mfac.Accounts.Guardian.AuthPipeline
  end

  scope "/api/v0/auth", MfacWeb do
    pipe_through :api

    post "/login", UserController, :sign_in_user
  end

  scope "/api/v0", MfacWeb do
    pipe_through :api_auth

    resources "/meetings", MeetingController
    resources "/agenda_items", AgendaItemController
    resources "/agenda_items/:agenda_item_id/votes", AgendaItemVoteController
    #resources "/agenda_item_votes", AgendaItemVoteController
    resources "/users", UserController, except: [:new, :edit]
    get "/user_data", UserController, :user_data
    post "/signup", UserController, :sign_up_user
    post "/update_user_profile", UserController, :update_user_profile
    post "/update_user_password", UserController, :update_user_password
    post "/agenda_items/:agenda_item_id/stack_entries", StackEntryController, :create
    delete "/agenda_items/:agenda_item_id/stack_entries", StackEntryController, :delete
    #delete "/agenda_items/:agenda_item_id/stack_entries", StackEntryController
    resources "/invitations", InvitationController, except: [:new, :edit]
    resources "/participants", ParticipantController, except: [:new, :edit]
  end
end
