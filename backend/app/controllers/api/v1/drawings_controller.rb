class Api::V1::DrawingsController < ApplicationController
  before_action :find_drawing, only: [:show, :update, :edit, :destroy]

  def index
    @drawings = Drawing.all
    render json: @drawings
  end

  def show
  end

  def create
    @drawing = Drawing.create(drawing_params)
  end

  private
  def find_drawing
    @drawing = Drawing.find(params[:id])
  end

  def drawing_params
    params.permit(:title, :image, :description)
  end
end