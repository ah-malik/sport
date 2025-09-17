export const ROUTES={
    AUTH:{
        LOGIN:'login',
        LOGOUT:'logout',
        REGISTER:'register',
        VERIFY:'verify',
        RESEND:'resend',
        FORGET:'forget',
        RESET:"reset"
    },
    USER:{
        PROFILE: ':id',
        UPDATE:'update/:id'
    },

    TOURNAMENT:{
        CREATE:'create',
        UPDATE:'update/:id',
        DELETE:'delete/:id',
        TOURNAMENT_PROFILE:':id',
        
    },
    TEAM:{
        CREATE:'create',
        UPDATE:'update/:id',
        DELETE:'delete/:id',
        PLAYER_ADD:'player_add/:id',
        PLAYER_REMOVE:'player_remove/:id'
    },
    PLAYER:{
        CREATE:'create',
        UPDATE:'update/:id',
        DELETE:'delete/:id',
     
    }
}