export class Session{
    constructor(DBComponent){
        this.DBComponent = DBComponent
    }

    async createSession(sessionObject, user){
        const dbUser = user?.[0] ?? {};
        const email = dbUser.email ?? dbUser.gmail ?? '';
        const name = dbUser.name ?? dbUser.nombre ?? '';

        console.log('Creando sesión para usuario:', email);

        sessionObject.request.session.user = {
            id: dbUser.id,
            email,
            name
        }

        console.log('Sesión creada:', sessionObject.request.session.user);
        console.log('Session ID:', sessionObject.request.sessionID);

        sessionObject.response.json({
            success: true,
            message: 'Se ha iniciado sesion correctamente',
            user: sessionObject.request.session.user
        })
    }

    sessionExist(sessionObject){
        const exists = sessionObject.request.session.user ? true : false;
        console.log('Verificando sesión:', exists ? 'EXISTE' : 'NO EXISTE');
        if (exists) {
            console.log('Usuario en sesión:', sessionObject.request.session.user);
        } else {
            console.log('No hay usuario en la sesión');
            console.log('Session object:', sessionObject.request.session);
        }
        return exists;
    }

    destroySession(sessionObject){
        sessionObject.request.session.destroy((error) =>{
            if (error) {
                sessionObject.response.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión'
                });
            }
                
            sessionObject.response.json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        })
    }

}