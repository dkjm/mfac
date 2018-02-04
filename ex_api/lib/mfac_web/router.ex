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
    resources "/topics", TopicController, except: [:new, :edit]
    resources "/topic_comments", TopicCommentController, except: [:new, :edit]
    resources "/stacks", StackController, except: [:new, :edit]
    resources "/users", UserController, except: [:new, :edit]
    resources "/stack_entries", StackEntryController, except: [:new, :edit]

  end
end
