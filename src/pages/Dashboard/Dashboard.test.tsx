import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { getTodoTasks } from "../../services/getTasks";
import { getUsers } from "../../services/getUsers";
import { MemoryRouter } from "react-router-dom";
import { useNavigate } from "react-router";

// Mock services
jest.mock("../../services/getTasks");
jest.mock("../../services/getUsers");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("Dashboard Component", () => {
  const mockTasks = [
    {
      id: 1,
      title: "Test Task",
      description: "Description 1",
      dueDate: "2025-10-24",
      priority: "High",
      status: "todo",
      assignedUser: "101",
    },
    {
      id: 2,
      title: "Completed Task",
      description: "Description 2",
      dueDate: "2025-10-25",
      priority: "Low",
      status: "done",
      assignedUser: "102",
    },
  ];

  const mockUsers = [
    { id: "101", name: "Alice" },
    { id: "102", name: "Bob" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner initially", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue([]);
    (getUsers as jest.Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
  });

  it("renders data grid with tasks after successful fetch", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue(mockTasks);
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText(/Task Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("Completed Task")).toBeInTheDocument();
    });
  });

  it("renders error message when API fails", async () => {
    (getTodoTasks as jest.Mock).mockRejectedValue(new Error("Failed"));
    (getUsers as jest.Mock).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load data. Please try again later./i)
      ).toBeInTheDocument();
    });
  });

  it("filters tasks by search term", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue(mockTasks);
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Test Task"));

    const searchInput = screen.getByPlaceholderText(/Search by Title/i);
    fireEvent.change(searchInput, { target: { value: "Completed" } });

    await waitFor(() => {
      expect(screen.getByText("Completed Task")).toBeInTheDocument();
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
    });
  });

  it("filters tasks by status", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue(mockTasks);
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Test Task"));

    const statusSelect = screen.getByLabelText("Status");
    fireEvent.mouseDown(statusSelect);
    const doneOption = await screen.findByText("Done");
    fireEvent.click(doneOption);

    await waitFor(() => {
      expect(screen.getByText("Completed Task")).toBeInTheDocument();
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
    });
  });

  it("navigates to Add Task page when Add button clicked", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue(mockTasks);
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Add New Task"));
    fireEvent.click(screen.getByText("Add New Task"));

    expect(mockNavigate).toHaveBeenCalledWith("/add-task");
  });

  it("navigates to Edit page when Edit button clicked", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue(mockTasks);
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Edit"));
    fireEvent.click(screen.getAllByText("Edit")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/edit-task?id=1");
  });

  it("clears filters when Clear Filters button clicked", async () => {
    (getTodoTasks as jest.Mock).mockResolvedValue(mockTasks);
    (getUsers as jest.Mock).mockResolvedValue(mockUsers);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Test Task"));

    const searchInput = screen.getByPlaceholderText(/Search by Title/i);
    fireEvent.change(searchInput, { target: { value: "Completed" } });

    await waitFor(() =>
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/Clear Filters/i));

    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
      expect(screen.getByText("Completed Task")).toBeInTheDocument();
    });
  });
});
