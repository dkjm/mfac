defmodule MfacWeb.Router do
  use MfacWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api/v0", MfacWeb do
    pipe_through :api

    resources "/meetings", MeetingController
    resources "/agenda_items", AgendaItemController
    resources "/agenda_item_votes", AgendaItemVoteController
    resources "/users", UserController, except: [:new, :edit]
    get "/user_data", UserController, :user_data
    resources "/stack_entries", StackEntryController, except: [:new, :edit]
    resources "/invitations", InvitationController, except: [:new, :edit]
    resources "/participants", ParticipantController, except: [:new, :edit]
  end
end
