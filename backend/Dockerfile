FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["backend/HRManagement.API/HRManagement.API.csproj", "backend/HRManagement.API/"]
COPY ["backend/HRManagement.Core/HRManagement.Core.csproj", "backend/HRManagement.Core/"]
COPY ["backend/HRManagement.Infrastructure/HRManagement.Infrastructure.csproj", "backend/HRManagement.Infrastructure/"]

RUN dotnet restore "backend/HRManagement.API/HRManagement.API.csproj"

# Copy everything else and build
COPY backend/ backend/
WORKDIR "/src/backend/HRManagement.API"
RUN dotnet build "HRManagement.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "HRManagement.API.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "HRManagement.API.dll"]
