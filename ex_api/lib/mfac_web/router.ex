defmodule MfacWeb.Router do
  use MfacWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api/v0", MfacWeb do
    pipe_through :api

    resources "/topics", TopicController, except: [:new, :edit]
    resources "/topic_comments", TopicCommentController, except: [:new, :edit]
    resources "/stacks", StackController, except: [:new, :edit]
    resources "/users", UserController, except: [:new, :edit]

  end
end
