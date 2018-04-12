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
    post "/signup", UserController, :sign_up_user
  end

  scope "/api/v0", MfacWeb do
    pipe_through :api_auth

    get "/user_data", UserController, :user_data
    post "/update_user_profile", UserController, :update_user_profile
    post "/update_user_password", UserController, :update_user_password

    resources "/meetings", MeetingController

    resources "/invitations", InvitationController, except: [:new, :edit]
    resources "/participants", ParticipantController, except: [:new, :edit]

    resources "/agenda_items", AgendaItemController
    resources "/agenda_items/:agenda_item_id/votes", AgendaItemVoteController

    post "/agenda_items/:agenda_item_id/stack_entries", StackEntryController, :create
    delete "/agenda_items/:agenda_item_id/stack_entries", StackEntryController, :delete

    resources "/proposals", ProposalController, except: [:new, :edit]
    resources "/proposals/:proposal_id/votes", ProposalVoteController

    resources "/amendments", AmendmentController, except: [:new, :edit]
    
  end
end
