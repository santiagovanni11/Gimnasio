# Etapa de compilación
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia el proyecto y restaura dependencias (cachea capas)
COPY GimnasioAPI/GimnasioAPI.csproj ./
RUN dotnet restore

# Copia el resto del código del backend y compila
COPY GimnasioAPI/ ./
RUN dotnet publish -c Release -o /app/publish

# Etapa de ejecución
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

EXPOSE 10000

COPY --from=build /app/publish ./

# Escucha en el puerto de la variable PORT (que inyecta Render) o 10000.
# sh -c expande $PORT en tiempo de ejecución.
ENTRYPOINT ["sh", "-c", "dotnet GimnasioAPI.dll --urls http://0.0.0.0:${PORT:-10000}"]
